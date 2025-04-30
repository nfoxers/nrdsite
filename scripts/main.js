function change_hname(addr, port) {
  addr.innerHTML = window.location.hostname;
  port.innerHTML = window.location.port || 80;
}

function change_stat(uptime, tvisit, uvisit) {
  fetch("/data/system.json")
  .then(response => {
    response.json().then(data => {
      uptime.innerHTML = data.uptime;
      tvisit.innerHTML = data.tvisits;
      uvisit.innerHTML = data.uvisits;
      if(response.headers.get("Node-Ran")) document.getElementById("errnonode").style = "display: none;"
    });
  })
  .catch(error => {
    uptime.innerHTML = "0 (E)";
    tvisit.innerHTML = "0 (E)";
    uvisit.innerHTML = "0 (E)";
    console.error("Error fetching stat data: ", error);
  });
}

async function get_json(url) {
  try {
    const res = await fetch(url);

    if(!res.ok) {
      throw new Error(`HTTP error, status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch(e) {
    console.error(e);
    return null;
  }
}

async function post_json(url, data) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data, null, 2),
    });

    if(!res.ok) {
      throw new Error(`HTTP post error, status: ${res.status}`);
    }

    const result = await res.json();
    return result;
  } catch(e) {
    console.error(e);
    return null;
  }
}

function get_date() {
  const now = new Date();
  const formatted = now.toLocaleString([], {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  return formatted;
}

function main() {
  const ipaddr = document.getElementById("ipaddr");
  const haddr = document.getElementById("hostname");
  const port = document.getElementById("port");
  const uptime = document.getElementById("uptime");
  const tvisit = document.getElementById("visit_y");
  const uvisit = document.getElementById("visit_n");
  
  change_hname(haddr, port);
  change_stat(uptime, tvisit, uvisit);

  fetch("https://ifconfig.me/all.json")
  .then(response => response.json())
  .then(data => {
    ipaddr.innerHTML = data.ip_addr;
    let dataj = {
      ip: data.ip_addr,
      time: get_date(),
    }

    post_json("/api/usr_visit", dataj);
    change_hname(haddr, port);
    change_stat(uptime, tvisit, uvisit);
    document.cookie = `ip=${data.ip_addr}`;
  })
  .catch(error => {
    console.error("Error fetching IP address: ", error);
    ipaddr.innerHTML = "127.0.0.1 (E)";
  });


  new TypeIt("#name", {
    speed: 100,
    waitUntilVisible: true,
  })
    .type("Narsdq", { delay: 750 })
    .delete(3)
    .type("ada")
    .move(null, { to: "END" })
    .type(" <span class='orange'>Fox</span>.")
    .pause(5000)
    .delete(11)
    .type("also a <span class='orange'>fox</span>.")
    .go();

  document.getElementById("mainimage").addEventListener("click", () => {
    document.getElementById("kliks").innerHTML++;
  });

  const form = document.getElementById("form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formdata = new FormData(form);

    fetch("https://ifconfig.me/all.json")
    .then(response => response.json())
    .then(data => {
      let msg = {
        name: formdata.get("name"),
        ip: data.ip_addr,
        message: formdata.get("text"),
        time: get_date(),
      }

      post_json("/api/usr_msg", msg);

      document.getElementById("form").reset();
    })
    .catch(error => {
      console.error("Error fetching IP address: ", error);
    });
  });

}

main();
