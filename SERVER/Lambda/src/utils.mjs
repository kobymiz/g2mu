export function withCors(response, opts = {}) {
  const {
    allowOrigin = '*',
    allowMethods = ['OPTIONS', 'GET', 'POST', 'PUT', 'DELETE'],
    allowHeaders = ['Content-Type', 'Authorization'],
  } = opts;

  const corsHeaders = {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': allowMethods.join(','),
    'Access-Control-Allow-Headers': allowHeaders.join(','),
  };

  return {
    ...response,
    headers: {
      ...response.headers,
      ...corsHeaders,
    },
  };
}