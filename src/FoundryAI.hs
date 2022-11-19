{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE QuasiQuotes #-}

module FoundryAI
  ( httpApp
  , socketApp
  , waiApp
  ) where

import           Control.Monad (forever)
import           Control.Monad.IO.Class (liftIO)
import           Data.Aeson (Value(..), object, (.=))
import qualified Data.Text as T
import           GHC.Conc
import           Network.Wai (Application)
import           Network.Wai.Handler.WebSockets (websocketsOr)
import qualified Network.WebSockets as WS
import qualified Web.Scotty as S

type Canvas = Value

scottyApp :: TVar Canvas -> S.ScottyM ()
scottyApp st = do
  S.get "/" $ do
    S.text "hello"

  S.post "/canvas" $
    S.jsonData >>= liftIO . atomically . writeTVar st

  S.get "/canvas" $
    liftIO (readTVarIO st) >>= S.json

  S.get "/some-json" $ do
    S.json $ object ["foo" .= Number 23, "bar" .= Number 42]

httpApp :: TVar Canvas -> IO Application
httpApp = S.scottyApp . scottyApp

socketApp :: TVar Canvas -> WS.ServerApp
socketApp _ pending = do
  conn <- WS.acceptRequest pending
  forever $ do
    msg <- WS.receiveData conn
    WS.sendTextData conn $ T.append msg ", back atcha!"

waiApp :: IO Application
waiApp = do
  st <- newTVarIO Null
  hApp <- httpApp st
  let sApp = socketApp st
  return $ websocketsOr WS.defaultConnectionOptions sApp hApp
