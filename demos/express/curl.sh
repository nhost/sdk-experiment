#/usr/bin/env bash

# using cookies
curl \
    -X POST \
    -b "nhostSession=%7B%22accessToken%22%3A%22eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDc4NDAwNDcsImh0dHBzOi8vaGFzdXJhLmlvL2p3dC9jbGFpbXMiOnsieC1oYXN1cmEtYWxsb3dlZC1yb2xlcyI6WyJ1c2VyIiwibWUiXSwieC1oYXN1cmEtZGVmYXVsdC1yb2xlIjoidXNlciIsIngtaGFzdXJhLXVzZXItaWQiOiI1Y2MxYjQ0OS05OTEyLTQwODAtOTVmNy0zZDI3MDMwNWJjNjIiLCJ4LWhhc3VyYS11c2VyLWlzLWFub255bW91cyI6ImZhbHNlIn0sImlhdCI6MTc0NzgzOTE0NywiaXNzIjoiaGFzdXJhLWF1dGgiLCJzdWIiOiI1Y2MxYjQ0OS05OTEyLTQwODAtOTVmNy0zZDI3MDMwNWJjNjIifQ.amTKxqrmFVtOCKrgkO3_gN-iIdi24kZuNF-e4ueWuCM%22%2C%22accessTokenExpiresIn%22%3A900%2C%22refreshToken%22%3A%223038a6aa-caf2-48c8-b901-bd626bb7494c%22%2C%22refreshTokenId%22%3A%2274376dd5-ff33-4b2c-bced-a0b847facfe9%22%2C%22user%22%3A%7B%22avatarUrl%22%3A%22https%3A%2F%2Fwww.gravatar.com%2Favatar%2Fa52a0027726bf3a4ec2728489732b38d%3Fd%3Dblank%26r%3Dg%22%2C%22createdAt%22%3A%222025-05-20T12%3A15%3A35.232886Z%22%2C%22defaultRole%22%3A%22user%22%2C%22displayName%22%3A%22asd%22%2C%22email%22%3A%22asdsad%40asd.com%22%2C%22emailVerified%22%3Atrue%2C%22id%22%3A%225cc1b449-9912-4080-95f7-3d270305bc62%22%2C%22isAnonymous%22%3Afalse%2C%22locale%22%3A%22en%22%2C%22metadata%22%3Anull%2C%22phoneNumberVerified%22%3Afalse%2C%22roles%22%3A%5B%22user%22%2C%22me%22%5D%7D%7D" \
    http://localhost:4000/cookies

# using Authorization header
curl \
    -X POST \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDc4NDAwNDcsImh0dHBzOi8vaGFzdXJhLmlvL2p3dC9jbGFpbXMiOnsieC1oYXN1cmEtYWxsb3dlZC1yb2xlcyI6WyJ1c2VyIiwibWUiXSwieC1oYXN1cmEtZGVmYXVsdC1yb2xlIjoidXNlciIsIngtaGFzdXJhLXVzZXItaWQiOiI1Y2MxYjQ0OS05OTEyLTQwODAtOTVmNy0zZDI3MDMwNWJjNjIiLCJ4LWhhc3VyYS11c2VyLWlzLWFub255bW91cyI6ImZhbHNlIn0sImlhdCI6MTc0NzgzOTE0NywiaXNzIjoiaGFzdXJhLWF1dGgiLCJzdWIiOiI1Y2MxYjQ0OS05OTEyLTQwODAtOTVmNy0zZDI3MDMwNWJjNjIifQ.amTKxqrmFVtOCKrgkO3_gN-iIdi24kZuNF-e4ueWuCM" \
    http://localhost:4000/auth-header
