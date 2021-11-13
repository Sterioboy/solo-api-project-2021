const expandData = document.getElementById("expandData");
const row1 = document.getElementById("row-1");

expandData.addEventListener("click", async (e) => {
  e.preventDefault();

  console.log(e.target.href);
  //Promise [Switch to Back-End] -> Controller.js -> res.json(task);
  const sendData = await fetch(e.target.href, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const newEntry = await sendData.json();
  const newSection = `
        <div class="row">
          <!-- Economic Data (1) -->
          <div class="col-lg-4">
            <div class="card mb-3">
              <div class="row g-0">
                <div class="col-md-12">
                  <div class="card-body">
                    <h5 class="card-title">${newEntry[0].name}</h5>
                    <p class="card-text">${newEntry[0].unit}</p>
                    <p class="card-text fw-bold">${newEntry[0].value}</p>
                    <p class="card-text"><small
                        class="text-muted"
                      >${newEntry[0].date}</small></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Economic Data (2) -->
          <div class="col-lg-4">
            <div class="card mb-3">
              <div class="row g-0">
                <div class="col-md-12">
                  <div class="card-body">
                    <h5 class="card-title">${newEntry[1].name}</h5>
                    <p class="card-text">${newEntry[1].unit}</p>
                    <p class="card-text fw-bold">${newEntry[1].value}</p>
                    <p class="card-text"><small
                        class="text-muted"
                      >${newEntry[1].date}</small></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Economic Data (3) -->
          <div class="col-lg-4">
            <div class="card mb-3">
              <div class="row g-0">
                <div class="col-md-12">
                  <div class="card-body">
                    <h5 class="card-title">${newEntry[2].name}</h5>
                    <p class="card-text">${newEntry[2].unit}</p>
                    <p class="card-text fw-bold">${newEntry[2].value}</p>
                    <p class="card-text"><small
                        class="text-muted"
                      >${newEntry[2].date}</small></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        `;

  console.log(newEntry);
  row1.insertAdjacentHTML("beforeend", newSection);
});
