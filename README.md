# Oauth-Spike

Project Startup:
Change the Web APi proejcts' web.config "auth:clientid" app setting to be the client id registered in Azure.

current resources: 
- https://azure.microsoft.com/en-us/documentation/articles/active-directory-integrating-applications/
- https://azure.microsoft.com/en-us/documentation/articles/active-directory-devquickstarts-webapi-dotnet/

For each environment: 
- Register the API app
- add the "auth:clientURI" (Slotted) app setting to be the same as
- add the "auth:redirectUri" (Slotted) app setting to be the same as the root url.
alternative: -Register one generic app for all environments
-register a "reply url" in Active Directory for each Environment.
- "auth:clientUri" can be a non-slotted app setting.
- "auth:redirectUri" must still be slotted per Environment.

For any frontend app: 
- ensure to include the "Resource" (same uri as the Client Uri/Root Uri) in the token request