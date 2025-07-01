// Core imports

export const handler = async (event) => {    
    console.log("Are you there? Lambda function started");
    console.log("Eevnt: ", JSON.stringify(event, null, 2));

    return {
            statusCode: 200,
            body: JSON.stringify({
              message: "Hello! Yes, I am here!",
              user: event.requestContext?.authorizer,
            })
          };
};