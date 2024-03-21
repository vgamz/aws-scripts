var AWS = require('aws-sdk');

exports.handler = async (event, context) => {
    var codepipeline = new AWS.CodePipeline();

    // Retrieve the Job ID from the Lambda action
    var jobId = event["CodePipeline.job"].id;

    // Custom logic to perform
    // ...

    // Notify CodePipeline of a successful job
    var putJobSuccess = function (message) {
        var params = {
            jobId: jobId,
            executionDetails: {
                summary: JSON.stringify(message),
                externalExecutionId: context.awsRequestId
            },
            outputVariables: {
                awsRequestId: context.awsRequestId
            }
        };

        return codepipeline.putJobSuccessResult(params, function (err, data) {
            if (err) {
                context.fail(err);
            } else {
                context.succeed(message);
            }
        }).promise();
    };

    // Notify CodePipeline of a failed job
    var putJobFailure = function (message) {
        var params = {
            jobId: jobId,
            failureDetails: {
                message: JSON.stringify(message),
                type: 'JobFailed',
                externalExecutionId: context.awsRequestId
            }
        };
        return codepipeline.putJobFailureResult(params, function (err, data) {
            if (err) {
                context.fail(message);
            }
        }).promise();
    };

    var response = await putJobSuccess("Tests passed.");

    return response;
};
