## How to create TSL key and cert to run local Angular app with HTTPS

* Create a new `certificate.cnf` and populate it with data to be included in the certificate (or use the one located in this folder) 
* Generate a private key with: `openssl genrsa -out server.key 2048`
* Create a Certificate Signing Request (CSR) with: `openssl req -new -key server.key -out server.csr -config ./certificate.cnf`
* Generate a self-signed TLS certificate with: `openssl x509 -req -in server.csr -signkey server.key -out server.crt -days 365`
* Add new start-script to package.json that starts `ng` with these options included `--ssl true --ssl-key server.key --ssl-cert server.crt`

*Hint*: There is already a start-script with these settings available in package.json: `start:ssl`. The keys used are located in `./web-app/ssl`.

