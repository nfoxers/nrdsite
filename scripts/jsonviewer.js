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

const jsonViewer = document.getElementById("jsonview");
jsonViewer.expanded = 2;
jsonViewer.indent = 2;
jsonViewer.showDataTypes = true;
jsonViewer.theme = "gruvbox-dark-hard";
jsonViewer.showToolbar = true;
jsonViewer.showSize = true;
jsonViewer.showCopy = true;
jsonViewer.expandIconType = "square";
jsonViewer.data = { info: "please wait before the JSON loads" };

const params = new URLSearchParams(window.location.search);

get_json(params.get("path")).then(data => {
  jsonViewer.data = data;
})