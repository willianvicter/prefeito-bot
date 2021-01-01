const dialogflow = require('dialogflow');
const uuid = require('uuid');
require('dotenv').config();

// Baseado em:
// https://medium.com/@tzahi/how-to-setup-dialogflow-v2-authentication-programmatically-with-node-js-b37fa4815d89

const LANGUAGE_CODE = 'pt-BR'

class DialogFlow {
    constructor(projectId = "prefeito-itapina-pwab") {
        this.projectId = projectId;

        let privateKey = (process.env.NODE_ENV == "production") ? JSON.parse(process.env.DIALOGFLOW_PRIVATE_KEY) : process.env.DIALOGFLOW_PRIVATE_KEY
        let clientEmail = process.env.DIALOGFLOW_CLIENT_EMAIL;
        let config = {
            credentials: {
                private_key: privateKey,
                client_email: clientEmail
            }
        }

        this.sessionClient = new dialogflow.SessionsClient(config)
    }

    async sendDialog(textMessage) {
        // Define session Id
        const sessionId = uuid.v4();
        // Define session path
        const sessionPath = this.sessionClient.sessionPath(this.projectId, sessionId);
        // The text query request.
        const request = {
            session: sessionPath,
            queryInput: {
                text: {
                    text: textMessage,
                    languageCode: LANGUAGE_CODE
                }
            }
        }
        try {

            let data = await this.sessionClient.detectIntent(request);

            let answer = "";
            let qanswer = data[0].queryResult.fulfillmentMessages;
            for (let i = 0; i < qanswer.length; i++) {
                answer += qanswer[i].text.text[0];
                if (i < qanswer.length - 1) answer += " ";
            }

            let response = {
                "question": data[0].queryResult.queryText,
                "answer": answer,
                "intent": data[0].queryResult.intent.displayName
            }

            return response;

        } catch (err) {
            console.error('DialogFlow.sendTextMessageToDialogFlow ERROR:', err);
            throw err
        }
    }
}

module.exports.DialogFlow = DialogFlow;