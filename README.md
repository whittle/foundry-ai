# Foundry AI

This is an experiment to see how much of a [Foundry
VTT](https://foundryvtt.com) game can be controlled by a remote
server. The goal is to create an FRP-oriented protocol suitable for
fully instrumenting a 2D VTT, but particularly specialized for
Foundry.

The project is comprised of two parts: a FoundryAI server and a
Foundry module to speak with that server. The communication between
the foundry-ai module and the FoundryAI server is via HTTP and
WebSocket.

The application-layer protocol currently under consideration is
[JMAP](https://www.ietf.org/rfc/rfc8620.html) with particular emphasis
on the [JMAP subprotocol for
WebSocket](https://www.ietf.org/rfc/rfc8887.html). The intent of using
JMAP is to abstract the state shared by the VTT and the FoundryAI
server as being isomorphic to a single (large) JSON document, and then
use JMAP to efficiently synchronize the necessary parts of that
document between the participants.

WebSocket support is prioritized over HTTP for performance
reasons. HTTP support for aspects of JMAP that can be conducted over
the JMAP subprotocol for WebSocket are expected to primarily be of
interest to implementations targeting clients more limited in their
commmunications options than Foundry VTT.
