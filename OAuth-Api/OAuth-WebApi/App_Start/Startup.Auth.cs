using System;
using System.Collections.Generic;
using System.Configuration;
using System.IdentityModel.Tokens;
using System.Linq;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin;
using Microsoft.Owin.Cors;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.ActiveDirectory;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.Google;
using Microsoft.Owin.Security.OpenIdConnect;
using Owin;
using OAuth_WebApi.Providers;
using OAuth_WebApi.Models;

namespace OAuth_WebApi
{
    public partial class Startup
    {
        public static string PublicClientId { get; private set; }

        // For more information on configuring authentication, please visit http://go.microsoft.com/fwlink/?LinkId=301864
        public void ConfigureAuth(IAppBuilder app)
        {
            app.SetDefaultSignInAsAuthenticationType(CookieAuthenticationDefaults.AuthenticationType);
            app.UseCookieAuthentication(new CookieAuthenticationOptions());

            var tenant = ConfigurationManager.AppSettings["auth:tenant"];
            var clientId = ConfigurationManager.AppSettings["auth:clientid"];
            app.UseOpenIdConnectAuthentication(
                new OpenIdConnectAuthenticationOptions
                {
                    ClientId = clientId,
                    Authority = $"https://login.microsoftonline.com/{tenant}",
                    RedirectUri = ConfigurationManager.AppSettings["auth:redirectUri"] ?? "http://localhost:55148"
                });

            app.UseWindowsAzureActiveDirectoryBearerAuthentication(new WindowsAzureActiveDirectoryBearerAuthenticationOptions()
            {
                Tenant = tenant,
                TokenValidationParameters = new TokenValidationParameters { ValidAudience = ConfigurationManager.AppSettings["auth:clientUri"] }

            });

            app.UseCors(CorsOptions.AllowAll);
        }
    }
}
