{-# LANGUAGE OverloadedStrings #-}

module Main (main) where

import qualified Conferer
import           Conferer.FromConfig.Warp ()
import qualified FoundryAI (waiApp)
import qualified Network.Wai.Handler.Warp as Warp


main :: IO ()
main = do
  config <- Conferer.mkConfig "foundry-ai"
  warpSettings <- Conferer.fetch config
  waiApp <- FoundryAI.waiApp
  Warp.runSettings warpSettings waiApp
