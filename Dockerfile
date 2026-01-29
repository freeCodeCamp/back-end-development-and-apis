FROM gitpod/workspace-node-lts:2026-01-21-13-55-44

WORKDIR /workspace/back-end-development-and-apis

COPY --chown=gitpod:gitpod . .
