import { parse } from '@babel/parser';

function children(node) {
  const result = [];
  for (const [key, value] of Object.entries(node)) {
    if (['loc', 'start', 'end', 'extra', 'errors', 'comments'].includes(key)) {
      continue;
    }
    if (Array.isArray(value)) {
      result.push(...value.filter(item => item?.type));
    } else if (value?.type) {
      result.push(value);
    }
  }
  return result;
}

function walk(root) {
  const nodes = [];
  const visit = node => {
    nodes.push(node);
    for (const child of children(node)) visit(child);
  };
  visit(root);
  return nodes;
}

function propertyName(member) {
  return member?.computed
    ? member.property?.value
    : member?.property?.name;
}

function callName(call) {
  if (call?.type !== 'CallExpression') return null;
  if (call.callee?.type === 'Identifier') return call.callee.name;
  return propertyName(call.callee);
}

function collectGuards(nodes) {
  const guards = new Map();
  const add = (name, position) => {
    if (!guards.has(name)) guards.set(name, []);
    guards.get(name).push(position);
  };

  for (const node of nodes) {
    if (
      node.type !== 'CallExpression' ||
      node.callee?.type !== 'MemberExpression' ||
      node.callee.object?.name !== 'assert'
    ) {
      continue;
    }
    const method = propertyName(node.callee);
    const first = node.arguments[0];
    if (
      ['exists', 'isDefined', 'isOk', 'isNotEmpty', 'lengthOf'].includes(method)
    ) {
      if (first?.type === 'Identifier') add(first.name, node.start);
    }
    if (
      ['isAbove', 'isAtLeast'].includes(method) &&
      first?.type === 'MemberExpression' &&
      propertyName(first) === 'length' &&
      first.object?.type === 'Identifier'
    ) {
      add(first.object.name, node.start);
    }
  }
  return guards;
}

function guarded(guards, name, position) {
  return guards.get(name)?.some(guardPosition => guardPosition < position) ?? false;
}

function riskyBindings(nodes) {
  const bindings = new Map();
  for (const node of nodes) {
    if (node.type !== 'VariableDeclarator' || node.id.type !== 'Identifier') continue;
    const init = node.init;
    if (init?.type !== 'CallExpression') continue;
    const name = callName(init);
    if (name === 'at' || name === 'match' || name === 'getVariable') {
      bindings.set(node.id.name, name);
    }
  }
  return bindings;
}

function unguardedDereferences(nodes) {
  const issues = [];
  const guards = collectGuards(nodes);
  const bindings = riskyBindings(nodes);

  for (const node of nodes) {
    if (node.type !== 'MemberExpression' || node.optional) continue;
    const object = node.object;
    if (object?.type === 'CallExpression') {
      const kind = callName(object);
      if (kind === 'at') {
        const receiver = object.callee.object;
        if (
          receiver?.type !== 'Identifier' ||
          !guarded(guards, receiver.name, node.start)
        ) {
          issues.push({ node, expression: '.at(...) result' });
        }
      } else if (kind === 'match') {
        issues.push({ node, expression: '.match(...) result' });
      } else if (kind === 'getVariable') {
        issues.push({ node, expression: 'getVariable(...) result' });
      }
      continue;
    }

    if (object?.type === 'Identifier' && bindings.has(object.name)) {
      if (!guarded(guards, object.name, node.start)) {
        issues.push({
          node,
          expression: `${bindings.get(object.name)} result '${object.name}'`
        });
      }
    }
  }

  // Keep outermost unique access. Babel exposes nested member nodes separately.
  return issues.filter(
    issue =>
      !issues.some(
        other =>
          other !== issue &&
          other.node.start === issue.node.start &&
          other.node.end > issue.node.end
      )
  );
}

export function lintBlock(code, context) {
  let ast;
  try {
    ast = parse(`async function __curriculumBlock() {\n${code}\n}`, {
      sourceType: 'module',
      plugins: ['dynamicImport']
    });
  } catch (error) {
    return [
      {
        ...context,
        status: 'lint',
        errorClass: 'ParseError',
        message: error.message
      }
    ];
  }

  const nodes = walk(ast.program);
  const records = [];
  for (const issue of unguardedDereferences(nodes)) {
    records.push({
      ...context,
      status: 'lint',
      errorClass: 'UnguardedDereference',
      message: `Unguarded ${issue.expression} dereference (line ${
        issue.node.loc.start.line - 1
      })`
    });
  }
  return records;
}

export function lintCorpus(projects) {
  const records = [];
  for (const project of projects) {
    for (const lesson of project.selectedLessons ?? project.lessons) {
      lesson.tests.forEach(([, code], testId) => {
        records.push(
          ...lintBlock(code, {
            project: project.dashedName,
            lesson: lesson.number,
            testId,
            block: 'test'
          })
        );
      });
      for (const block of ['beforeAll', 'beforeEach', 'afterEach', 'afterAll']) {
        if (!lesson[block]) continue;
        records.push(
          ...lintBlock(lesson[block], {
            project: project.dashedName,
            lesson: lesson.number,
            testId: null,
            block
          })
        );
      }
    }
  }
  return records;
}
