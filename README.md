# nrdsite
### Description
This is the official Github repository for my own (v3) personal site.  
As of now I have not yet decided what will be this website's domain name, so i'll keep it floating for now.

### Note
For the HTTPS service you have to provide your own SSL key (env/server.key) and the certificate (env/server.cert).  
Without those files, the site may not work properly for HTTPS request; only HTTP.  

And the server.js file is equipped with some failsafe measures including nonroot port issues, so if you're running it
inside a nonroot environment, dont change the ports, it'll automatically change the port appropriately.

P.S. Who would even host a website for some random guy for free anyway? 