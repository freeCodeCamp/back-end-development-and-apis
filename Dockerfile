FROM gitpod/workspace-node-lts:2024-02-14-13-04-03

WORKDIR /workspace/back-end-development-and-apis

COPY --chown=gitpod:gitpod . .
