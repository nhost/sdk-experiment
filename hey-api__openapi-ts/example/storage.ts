import { createClient, createClientConfig } from '@hey-api/client-fetch';
import { client } from '../storage/client.gen';
import { StorageService } from '../storage/sdk.gen';

// create demo function
export async function demo() {
    const localClient = createClient({
      // set default base url for requests made by this client
      baseUrl: 'https://petstore3.swagger.io/api/v3',
      /**
       * Set default headers only for requests made by this client. This is to
       * demonstrate local clients and their configuration taking precedence over
       * internal service client.
       */
      headers: {
        Authorization: 'Bearer <token_from_local_client>',
      },
    });

    uploadFiles(
        {
            client: localClient,
            body: {}


        },
    )


}
