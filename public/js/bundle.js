/* eslint-disable */ function $1eb0cc260df27e1b$export$27077c57cd15b0d5(type, msg) {
    $1eb0cc260df27e1b$export$516836c6a9dfc573();
    const markup = `<div class="alert" alert--${type}">${msg}</div>`;
    document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
    setTimeout($1eb0cc260df27e1b$export$516836c6a9dfc573, 5000);
}
function $1eb0cc260df27e1b$export$516836c6a9dfc573() {
    const el = document.querySelector(".alert");
    el && el.remove();
}


async function $e33d9ff231aec008$export$596d806903d1f59e(email, password) {
    try {
        // TODO: Learn to do this the vanilla way
        const res = await axios({
            method: "POST",
            url: "http://localhost:3000/api/v1/users/login",
            data: {
                email: email,
                password: password
            }
        });
        if (res.data.status === "success") {
            (0, $1eb0cc260df27e1b$export$27077c57cd15b0d5)("success", "Login Successful");
            window.setTimeout(()=>{
                window.location.href = "/";
            }, 1000);
        }
    } catch (err) {
        (0, $1eb0cc260df27e1b$export$27077c57cd15b0d5)("error", err.message);
    }
}
async function $e33d9ff231aec008$export$a0973bcfe11b05c9() {
    try {
        // TODO: Learn to do this the vanilla way
        const res = axios({
            method: "GET",
            url: "http://localhost:3000/api/v1/users/logout"
        });
        if (res.data.status === "success") {
            (0, $1eb0cc260df27e1b$export$27077c57cd15b0d5)("success", "Logout Successful");
            window.setTimeout(()=>{
                window.location.href = "/";
            }, 1000);
        }
    } catch (err) {
        (0, $1eb0cc260df27e1b$export$27077c57cd15b0d5)("error", err.message);
    }
}


/* eslint-disable */ function $f6b1c9ed51ec7162$export$4c5dd147b21b9176(locationsArray) {
    mapboxgl.accessToken = "pk.eyJ1IjoidGhlYWltaGVybyIsImEiOiJjbGkxYzdqdWowMTdzM3VwbW0wNWhsbWoxIn0.MU63tR9TXa5GDSTR0jS0yw";
    const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/theaimhero/cli23mu1400kk01pn258lcdtw",
        interactive: false
    });
    const bounds = new mapboxgl.LngLatBounds();
    locationsArray.forEach((loc)=>{
        const el = document.createElement("div");
        el.className = "marker";
        new mapboxgl.Marker({
            element: el,
            anchor: "bottom"
        }).setLngLat(loc.coordinates).addTo(map);
        new mapboxgl.Popup({
            offset: 35
        }).setLngLat(loc.coordinates).setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`).addTo(map);
        bounds.extend(loc.coordinates);
    });
    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 150,
            left: 200,
            right: 200
        }
    });
}


const $1cd085a7ac742057$var$loginForm = document.querySelector("form");
if ($1cd085a7ac742057$var$loginForm) $1cd085a7ac742057$var$loginForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    console.log(email, password);
    (0, $e33d9ff231aec008$export$596d806903d1f59e)(email, password);
});
const $1cd085a7ac742057$var$mapBox = document.getElementById("map");
if ($1cd085a7ac742057$var$mapBox) {
    const { locations: locations  } = $1cd085a7ac742057$var$mapBox.dataset;
    const locationsArray = JSON.parse(locations);
    (0, $f6b1c9ed51ec7162$export$4c5dd147b21b9176)(locationsArray);
}
const $1cd085a7ac742057$var$logoutBtn = document.getElementById("logout");
if ($1cd085a7ac742057$var$logoutBtn) $1cd085a7ac742057$var$logoutBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    (0, $e33d9ff231aec008$export$a0973bcfe11b05c9)();
});


//# sourceMappingURL=bundle.js.map
