document
  .getElementById("data-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form submission

    const startDateInput = document.getElementById("start-date").value;
    console.log(startDateInput);
    const endDateInput = document.getElementById("end-date").value;
    console.log(endDateInput);
    const vmId = document.getElementById("vm-id").value;
    const appKey = document.getElementById("app-key").value;
    const secretKey = document.getElementById("secret-key").value;

    try {
      const token = await authenticateAPI(appKey, secretKey);
      await getData(startDateInput, endDateInput, vmId, token);
    } catch (error) {
      console.error("Error:", error);
    }
  });

function formatDate(dateString) {
  const parts = dateString.split("/");
  const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
  return formattedDate;
}

async function authenticateAPI(appKey, secretKey) {
  // const appKey = "6a5b3f78-3088-4371-be1f-b409095e6b33";
  // const secretKey = "xtKDK1JCgNTGcFRl2aTSc7k7FD02nGrO";

  const response = await fetch(
    "https://api.cloudraya.com/v1/api/gateway/user/auth",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        app_key: appKey,
        secret_key: secretKey,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to authenticate");
  }

  const data = await response.json();
  console.log(data);
  const token = data.data.bearer_token;
  console.log(token);

  return token;
}

async function getData(startDate, endDate, vmId, token) {
  const requestData = {
    vm_id: vmId,
    start_date: startDate,
    end_date: endDate,
  };

  console.log(requestData);

  const response = await fetch(
    "https://api.cloudraya.com/v1/api/gateway/user/virtualmachines/load-bandwidth-usage",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await response.json();
  console.log(data);
  const tableBody = document.querySelector("#example tbody");
  tableBody.innerHTML = ""; // Clear existing table data

  const items = data.data; // Ubah properti ini sesuai dengan struktur data JSON yang Anda terima
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const row = tableBody.insertRow();
    const cell1 = row.insertCell();
    const cell2 = row.insertCell();
    const cell3 = row.insertCell();
    const cell4 = row.insertCell();
    const cell5 = row.insertCell();
    const cell6 = row.insertCell();
    cell1.innerHTML = item.usage;
    cell2.innerHTML = item.cost;
    cell3.innerHTML = item.date;
    cell4.innerHTML = item.hour;
    cell5.innerHTML = item.type;
    cell6.innerHTML = item.converted_date;
  }
}

// const token = authenticateAPI();
// const tanggalMulai = formatDate();
// const tanggalAkhir = formatDate();
