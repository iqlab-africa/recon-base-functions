import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

export async function ping(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(
      `🥦 🥦 🥦 Http function processed request for url "${request.url}"`
    );

    const name = request.query.get('name') || await request.text() || 'Global South';

    return { body: `🥦 🥦 🥦 Hello, ${name}!` };
};

app.http('ping', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: ping
});
