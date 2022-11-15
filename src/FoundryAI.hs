{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE QuasiQuotes #-}

module FoundryAI
  ( httpApp
  , socketApp
  , waiApp
  ) where

import           Control.Monad (forever)
import           Data.Aeson (Value(..), object, (.=))
import qualified Data.Text as T
import           Network.Wai (Application)
import           Network.Wai.Handler.WebSockets (websocketsOr)
import qualified Network.WebSockets as WS
import qualified Web.Scotty as S

app' :: S.ScottyM ()
app' = do
  S.get "/" $ do
    S.text "hello"

  S.get "/some-json" $ do
    S.json $ object ["foo" .= Number 23, "bar" .= Number 42]

httpApp :: IO Application
httpApp = S.scottyApp app'

socketApp :: WS.ServerApp
socketApp pending = forever $ do
  conn <- WS.acceptRequest pending
  forever $ do
    msg <- WS.receiveData conn
    WS.sendTextData conn $ T.append msg ", back atcha!"

waiApp :: IO Application
waiApp =
  websocketsOr WS.defaultConnectionOptions socketApp <$> httpApp
