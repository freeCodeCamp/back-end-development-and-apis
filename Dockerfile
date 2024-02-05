FROM gitpod/workspace-full

WORKDIR /workspace/back-end-development-and-apis

COPY --chown=gitpod:gitpod . .
