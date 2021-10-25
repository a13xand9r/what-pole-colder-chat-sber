import { SmartAppBrainRecognizer } from '@salutejs/recognizer-smartapp-brain'
import {
    createIntents,
    createMatchers,
    createSaluteRequest,
    createSaluteResponse,
    createScenarioWalker,
    createSystemScenario,
    createUserScenario,
    NLPRequest,
    NLPResponse,
    SaluteRequest
} from '@salutejs/scenario'
import { SaluteMemoryStorage } from '@salutejs/storage-adapter-memory'
import { noMatchHandler, northPoleHandler, runAppHandler, southPoleHandler, whatIsColderHandler } from './handlers'
import model from './intents.json'
// require('dotenv').config()

const storage = new SaluteMemoryStorage()
const intents = createIntents(model.intents)
const { match, intent } = createMatchers<SaluteRequest, typeof intents>()

const userScenario = createUserScenario({
    WhatIsColder: {
        match: intent('/Какой холоднее', {confidence: 0.5}),
        handle: whatIsColderHandler
    },
    NorthPole: {
        match: intent('/Северный полюс', {confidence: 0.5}),
        handle: northPoleHandler
    },
    SouthPole: {
        match: intent('/Южный полюс', {confidence: 0.5}),
        handle: southPoleHandler
    },
})

const systemScenario = createSystemScenario({
    RUN_APP: runAppHandler,
    NO_MATCH: noMatchHandler
})

const scenarioWalker = createScenarioWalker({
    recognizer: new SmartAppBrainRecognizer('ff9e15b8-4221-4ccb-9d0c-d8b59aa02a8d'),
    intents,
    systemScenario,
    userScenario
})

export const handleNlpRequest = async (request: NLPRequest): Promise<NLPResponse> => {
    const req = createSaluteRequest(request)
    const res = createSaluteResponse(request)
    const sessionId = request.uuid.userId
    const session = await storage.resolve(sessionId)
    console.log(req.inference?.variants)
    await scenarioWalker({ req, res, session })

    await storage.save({ id: sessionId, session })

    return res.message
}