function change_ip(element) {
  fetch("https://api.ipify.org?format=json")
    .then(response => response.json())
    .then(data => {
      element.innerHTML = data.ip;
    })
    .catch(error => {
      element.innerHTML = "127.0.0.1 (E)"
      console.error("Error fetching IP address: ", error);
    });
}

function change_hname(addr, port) {
  addr.innerHTML = window.location.hostname;
  port.innerHTML = window.location.port;
}

function change_stat(uptime, tvisit, uvisit) {
  fetch("/data/system.json")
  .then(response => response.json())
  .then(data => {
    uptime.innerHTML = data.uptime;
    tvisit.innerHTML = data.tvisits;
    uvisit.innerHTML = data.uvisits;
  })
  .catch(error => {
    uptime.innerHTML = "0 (E)";
    tvisit.innerHTML = "0 (E)";
    uvisit.innerHTML = "0 (E)";
    console.error("Error fetching stat data: ", error);
  });
}

function main() {
  const ipaddr = document.getElementById("ipaddr");
  const haddr = document.getElementById("hostname");
  const port = document.getElementById("port");
  const uptime = document.getElementById("uptime");
  const tvisit = document.getElementById("visit_y");
  const uvisit = document.getElementById("visit_n");
  
  change_ip(ipaddr);
  change_hname(haddr, port);
  change_stat(uptime, tvisit, uvisit);
}

main();