(function () {
  const config = {
    realm: "test-realm",
    clientId: "test-client",
    scope: "web-app",
    url: "https://localhost:8443",
    "ssl-required": "external",
    "public-client": true,
    "confidential-port": 0
  };

  const keycloak = new Keycloak(config);
  keycloak
    .init({
      onLoad: "login-required",
      promiseType: "native"
    })
    .then(function (authenticated) {
      const userInfoElement = document.getElementById("userInfo");
      const authStatusElement = document.getElementById("authStatus");

      if (authenticated) {
        authStatusElement.textContent = "Authenticated!";

        const username = keycloak.tokenParsed.preferred_username;
        const email = keycloak.tokenParsed.email;

        userInfoElement.innerHTML = `
          <p>Username: ${username}</p>
          <p>Email: ${email}</p>
        `;
      } else {
        authStatusElement.textContent = "Not Authenticated";
        userInfoElement.textContent = "";
      }

      const logoutBtn = document.querySelector(".logout-button");

      if (logoutBtn) {
        logoutBtn.style.display = 'block'
        logoutBtn.addEventListener("click", function () {
          keycloak.logout();
        });
      }
    })
    .catch(function (error) {
      console.error(error);
      alert("failed to initialize");
    });
})();
