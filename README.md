# Foundry AI

This is a trial to see how much of the [Foundry
VTT](https://foundryvtt.com) API can be controlled by a remove server
over a WebSocket. The goal is to create an FRP-oriented protocol
suitable for fully instrumenting a 2D VTT, but particularly
specialized for Foundry. The intent is to use a WebSocket, but support
for polling via HTTP may be considered, if this project goes beyond
Foundry.

The project is comprised of two parts: a Haskell WebSocket server and
a Foundry module.
