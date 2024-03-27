import express from "express"
import Joi from "joi"
import { error, success } from "../utils/api"
import { validate } from "../utils/schema"
import dotenv from "dotenv"

dotenv.config()

const SCHEMA = Joi.object({
    project: Joi.string().required()
})

export default (req: express.Request, res: express.Response) => {
    const valid = validate(SCHEMA, req.body || {})

    if (valid.error) {
        return error(res, 401, valid.data)
    }

    const data = valid.data

    fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.ACCOUNT_ID}/pages/projects/${data.project}/`, {
        method: "GET",
        headers: {
            authorization: `Bearer ${process.env.API_TOKEN}`
        }
    }).then((response: Response) => {
        response.json().then((data: any) => {
            try {
                data = data.result

                const latestDeploymentGitHash = (data.latest_deployment !== undefined && data.latest_deployment.deployment_trigger.type.includes("github") ? data.latest_deployment.deployment_trigger.metadata.commit_hash : "")
                const currentDeploymentGitHash = (data.canonical_deployment !== undefined && data.canonical_deployment.deployment_trigger.type.includes("github") ? data.canonical_deployment.deployment_trigger.metadata.commit_hash : "")

                const latestDeployment = {
                    id: data.latest_deployment.id,
                    environment: data.latest_deployment.environment,
                    created_on: data.latest_deployment.created_on,
                    modified_on: data.latest_deployment.modified_on,
                    status: data.latest_deployment.latest_stage.status,
                    git_hash: latestDeploymentGitHash
                }

                const currentDeployment = {
                    id: data.canonical_deployment.id,
                    environment: data.canonical_deployment.environment,
                    created_on: data.canonical_deployment.created_on,
                    modified_on: data.canonical_deployment.modified_on,
                    status: data.canonical_deployment.latest_stage.status,
                    git_hash: currentDeploymentGitHash
                }

                const formattedData = {
                    id: data.id,
                    name: data.name,
                    subdomain: data.subdomain,
                    domains: data.domains,
                    latest_deployment: latestDeployment,
                    current_deployment: currentDeployment
                }

                console.log(formattedData)

                success(res, formattedData, 200, "Done")
            } catch (e) {
                error(res, 400, "Something went wrong when fetching and parsing data.")
            }
        })
    })
}