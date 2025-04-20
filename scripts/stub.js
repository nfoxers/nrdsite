fetch("https://ifconfig.me/all.json")
.then(response => response.json())
.then(data => {
  document.cookie = `ip=${data.ip_addr}`;
})
.catch(error => {
  console.error("Error fetching IP address: ", error);
});