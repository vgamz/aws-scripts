import { CodePipeline } from '@aws-sdk/client-codepipeline';

// Handler to listen to CloudTrail EventBridge events for S3
// and start pipeline execution with object version that triggered the event 
export const handler = async (event, context) => {
    var startPipelineExecutionInput = {
        name: "pipeline-name",
        sourceRevisions: [
            {
                "actionName": "S3Source-action-name",
                "revisionType": "S3_OBJECT_VERSION_ID",
                // Extracts s3 object version that triggered the event
                "revisionValue": event["detail"]["responseElements"]["x-amz-version-id"]
            }
        ]
    }

    var response = await new CodePipeline().startPipelineExecution(startPipelineExecutionInput);
    console.log("StartPipelineExecutionOutput:" + JSON.stringify(response));
};
