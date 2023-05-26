# Keycloak Theming Environment

#### Usage

* Install Docker on your host machine
* Depending on what web app you prefer run:
   > `docker-compose --profile angular up -d`

   > `docker-compose --profile web-simple up -d`
   
* Alternatively, run it "headless" with `docker compose up -d`. Then hook up your own web app.
* Open [https://localhost:8443](https://localhost:8443) and then go to Keycloak admin console. Use `admin` and `password` as your credentials.

![kc_main_page](images/kc_main_page.png)

* In the admin console select `test-realm` and then go to `Users` to add a new one. 

![create_new_user](./images/create_new_user.png) 

* Assign it a password under `Credentials` and an email. The email can be anything as long as it's a valid email. Also select `Email verified` to complete the task.

![user_settings](images/user_settings.png)

* Then select `master` realm and add an email for your admin user (again, it can be anything, just select `Email verified` afterwards)

![admin_settings](images/admin_settings.png)
  
* Now go to `master` realm's settings and under the tab **Email** set `From` and `Host` to this:

![maildev_settings](images/maildev_settings.png)

* To test the *MailDev* settings you can send an email by clicking the button `Test Connection` that is located below `Connection & Authentication`.

![maildev_test](images/maildev_test.png)

* You should see a message like this

![maildev_test_success](images/maildev_test_success.png)

* Now open *MailDev* server on http://localhost:1080. You should see the test email in the list:

![maildev_ui](images/maildev_ui.png)

* Now go to web app and logon as user you setup previously.

![login_form](./images/login_form.png)

## Changing themes

* Go to Admin console and select `Realm Settings` of the `test-realm`.
* Select tab `Themes` to change the theme for login forms.
  
  > If your theme doesn't appear in the dropdown list, make sure you copied its folder to the volume `themes` that maps to the folder [themes](./themes/) located in this project.
  ---
  > In the example below I am using the nice `keywind` theme which you can find [on GitHub](https://github.com/lukin/keywind).

![theme_change](images/theme_change.png)

* The go back to web app and log off from there. You will be redirected to a new Keycloak theme.

![new_theme](images/new_theme.png)

## Adding new themes

As Keycloak is loading themes only once at initial start, we need a mechanism that allows us to introduce new themes without having to restart everything. This is done with the `watcher` container that is polling the status of the docker volume `themes`. Each time we add or remove a folder there, `watcher` will restart the Keycloak instance.

![watcher_settings](images/watcher_settings.png)

![watcher_shell](images/watcher_shell.png)

Additionally, Keycloak instances defined in [docker-compose.yml](docker-compose.yml) start with the following flags applied to allow changing UI designs on-the-fly.

```yaml
    - --spi-theme-static-max-age=-1
    - --spi-theme-cache-themes=false
    - --spi-theme-cache-templates=false
```
## Test Realm

The Keycloak instance automatically imports a `test-realm` from a JSON file can be found [here](./import/test-realm.json). Feel free to create own realms but don't forget to introduce them in Keycloak's import flag in [docker-compose.yaml](./docker-compose.yml). Also take into account that users must always be defined manually as realm JSONs only contain realm's data, not user's.

## Docker Containers

The services used in this environment are:

* PostgreSQL
* Keycloak
* Web (Angular & simple)
* MailDev
* Watcher
* CertSetup
---

> **Postgresql** is used by Keycloak and doesn't need any manual configuration. Just leave it as it is.

> **Keycloak** runs in production mode but with caching disabled to make design changes immediately visible.

> **Web application** can either be: 
> * an Angular app
> * or a simple HTML page that executes a [script](./web-app_simple/kc-client.js)
---
> * To start Angular app use `--profile angular` when invoking `docker compose`

![angular_profile](images/angular_profile.png)

> * To start HTML page use `--profile web-simple` instead.

![web_simple](images/web-simple.png)

> If you want to use your own web app then just run `docker compose up -d` which will start without any web app.

---

*Notice:* Angular app runs over SSL by default.

To create new TLS certs, check the [HOWTO](./web-app/ssl/HOWTO.md) in `webapp/ssl` folder.

> **Watcher** service is used to watch over the `themes` directory and restart Keycloak each time it gets changed.


> **MailDev** is a service for mimicking e-mail delivery. This is especially useful when testing Keycloak's `forgot password` functionality.


> **CertSetup** generates certificates and keystores for Keycloak. It stops automatically after successful completion.

---

#### Themes

The folder `themes` is a docker volume that can be accessed by Keycloak. To introduce a new theme just copy its folder to this volume. The Watcher will then restart the Keycloak instance to make it available in `Realm Settings`.

## LICENSE
[MIT](./LICENSE)