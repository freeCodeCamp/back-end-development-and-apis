FROM gitpod/workspace-node-lts:2026-02-12-23-06-03

WORKDIR /workspace/back-end-development-and-apis

COPY --chown=gitpod:gitpod . .
