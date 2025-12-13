function formatVND(number) {
  if (typeof number !== "number") return "";
  return number.toLocaleString("vi-VN") + "₫"; // hoặc cách định dạng khác
}

const ROOM_PRICES = {
  "1G": {
    ngayHienTai: 300000,
    gio: 80000,
    trongNgay: 250000,
    quaDem: 350000,
    tuan: 1800000,
    thang: 6500000,
    ngayCu: 280000,
    cuoiTuan: 390000, // Giá Thứ 7/Cuối tuần
  },
  "2G": {
    ngayHienTai: 350000,
    gio: 90000,
    trongNgay: 300000,
    quaDem: 400000,
    tuan: 2000000,
    thang: 7000000,
    ngayCu: 320000,
    cuoiTuan: 450000, // Giá Thứ 7/Cuối tuần
  },
  "3G": {
    ngayHienTai: 400000,
    gio: 100000,
    trongNgay: 350000,
    quaDem: 450000,
    tuan: 2200000,
    thang: 7500000,
    ngayCu: 380000,
    cuoiTuan: 520000, // Giá Thứ 7/Cuối tuần
  },
  VIP: {
    ngayHienTai: 700000,
    gio: 150000,
    trongNgay: 500000,
    quaDem: 700000,
    tuan: 3500000,
    thang: 12000000,
    ngayCu: 650000,
    cuoiTuan: 910000, // Giá Thứ 7/Cuối tuần
  },
  APT: {
    ngayHienTai: 750000,
    gio: 150000,
    trongNgay: 550000,
    quaDem: 750000,
    tuan: 3800000,
    thang: 13000000,
    ngayCu: 700000,
    cuoiTuan: 975000, // Giá Thứ 7/Cuối tuần
  },
};

function getPrice(roomType) {
  const p = ROOM_PRICES[roomType];
  if (!p) return [0, 0, 0, 0, 0, 0, 0, 0];

  return [
    p.ngayHienTai, // 0: ngày hiện tại (Đầu tuần)
    p.gio, // 1: giá giờ
    p.trongNgay, // 2: trong ngày
    p.quaDem, // 3: qua đêm
    p.tuan, // 4: tuần
    p.thang, // 5: tháng
    p.ngayCu, // 6: ngày cũ
    p.cuoiTuan, // 7: cuối tuần (Thứ 7)
  ];
}

function shareCard() {
  if (navigator.share) {
    navigator.share({
      title: "Sâm Nguyễn Hotel",
      text: "Danh thiếp điện tử của Sâm Nguyễn Hotel",
      url: window.location.href,
    });
  } else {
    alert("Trình duyệt không hỗ trợ chia sẻ.");
  }
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) {
    el.style.display = "none";
    document.body.style.overflow = "";
  }
}

function copyBank() {
  const bankEl = document.getElementById("bankNum");
  if (!bankEl) {
    console.warn("copyBank: element #bankNum not found");
    return;
  }
  const t = bankEl.innerText.replace(/\s+/g, "").trim();

  navigator.clipboard
    .writeText(t)
    .then(() => alert("Đã sao chép: " + t))
    .catch(() => alert("Không thể sao chép, vui lòng làm thủ công."));
}

function togglePrice() {
  const table = document.getElementById("priceTable");
  if (!table) {
    console.warn("togglePrice: element #priceTable not found");
    return;
  }
  table.style.display =
    table.style.display === "none" || table.style.display === ""
      ? "block"
      : "none";
}

function updateAncestorHeights(element) {
  let parent = element.closest(".accordion-content");

  while (parent) {
    if (
      parent.classList.contains("active") &&
      parent.style.maxHeight &&
      parent.style.maxHeight !== "none"
    ) {
      parent.style.maxHeight = parent.scrollHeight + "px";
    }
    parent = parent.parentElement
      ? parent.parentElement.closest(".accordion-content")
      : null;
  }
}

function toggleAccordionContent(header) {
  const content = header.nextElementSibling;
  if (!content) return;

  const isOpening = !content.classList.contains("active");

  if (isOpening) {
    content.classList.add("active");
    header.classList.add("active");

    requestAnimationFrame(() => {
      content.style.maxHeight = content.scrollHeight + "px";
    });
    updateAncestorHeights(content);
  } else {
    if (content.style.maxHeight === "none" || !content.style.maxHeight) {
      content.style.maxHeight = content.scrollHeight + "px";
    }

    requestAnimationFrame(() => {
      content.style.maxHeight = "0px";
    });

    header.classList.remove("active");
    content.classList.remove("active");
  }

  content.addEventListener(
    "transitionend",
    function onEnd(e) {
      if (e.target !== content) return;

      if (isOpening) {
        content.style.maxHeight = "none";
      } else {
        content.style.maxHeight = null;
      }

      updateAncestorHeights(content);

      content.removeEventListener("transitionend", onEnd);
    },
    { once: true }
  );
}

function setupAccordions() {
  const modalHeaders = document.querySelectorAll(
    "#roomModal .accordion-header"
  );
  modalHeaders.forEach((header) => {
    if (!header.dataset.init) {
      try {
        header.setAttribute("type", "button");
      } catch (e) {}

      const handleModalHeader = function (e) {
        if (e && typeof e.preventDefault === "function") e.preventDefault();
        document
          .querySelectorAll("#roomModal .accordion-header")
          .forEach((h) => {
            if (h !== this && h.classList.contains("active")) {
              toggleAccordionContent(h);
            }
          });
        toggleAccordionContent(this);
      };

      header.addEventListener("click", handleModalHeader);
      header.addEventListener(
        "touchstart",
        function (e) {
          handleModalHeader.call(this, e);
        },
        { passive: false }
      );

      header.dataset.init = "yes";
    }
  });

  const subs = document.querySelectorAll(".sub-accordion-header");
  subs.forEach((header) => {
    if (!header.dataset.init) {
      try {
        header.setAttribute("type", "button");
      } catch (e) {}

      const handleSub = function (e) {
        if (e && typeof e.preventDefault === "function") e.preventDefault();
        if (e && typeof e.stopPropagation === "function") e.stopPropagation();
        const content = this.nextElementSibling;
        if (!content) return;
        const container = this.closest(".accordion-content") || document;
        container.querySelectorAll(".sub-accordion-header").forEach((h) => {
          if (h !== this && h.classList.contains("active")) {
            toggleAccordionContent(h);
          }
        });
        toggleAccordionContent(this);
      };

      header.addEventListener("click", handleSub);
      header.addEventListener(
        "touchstart",
        function (e) {
          handleSub.call(this, e);
        },
        { passive: false }
      );

      header.dataset.init = "yes";
    }
  });

  const outsides = document.querySelectorAll(
    ".accordion-item.outside .accordion-header"
  );
  outsides.forEach((header) => {
    if (!header.dataset.init) {
      try {
        header.setAttribute("type", "button");
      } catch (e) {}

      const handleOutside = function (e) {
        if (e && typeof e.preventDefault === "function") e.preventDefault();
        const content = this.nextElementSibling;
        if (!content) return;
        document
          .querySelectorAll(".accordion-item.outside .accordion-header")
          .forEach((h) => {
            if (h !== this && h.classList.contains("active")) {
              toggleAccordionContent(h);
            }
          });
        toggleAccordionContent(this);
      };

      header.addEventListener("click", handleOutside);
      header.addEventListener(
        "touchstart",
        function (e) {
          handleOutside.call(this, e);
        },
        { passive: false }
      );

      header.dataset.init = "yes";
    }
  });
}

function renderGallery(images) {
  try {
    const gallery = document.getElementById("roomGallery");
    if (!gallery) return;
    gallery.innerHTML = "";

    if (!Array.isArray(images) || images.length === 0) return;

    const mainImg = document.getElementById("roomImg");
    const baseUrl = "https://samnguyenhotel.com/wp-content/uploads/2025/11/";

    const first = images[0] != null ? String(images[0]) : "";
    if (mainImg && first) mainImg.src = baseUrl + first;

    images.forEach((imageName) => {
      const name = imageName != null ? String(imageName) : "";
      if (!name) return;
      const item = document.createElement("img");
      item.className = "gallery-item";
      item.src = baseUrl + name;
      item.alt = "Ảnh phòng";
      item.addEventListener("click", () => {
        if (mainImg) mainImg.src = item.src;
      });
      gallery.appendChild(item);
    });
  } catch (err) {
    console.warn("renderGallery error", err);
  }
}

function showRoom(title, images, desc, prices, amen, oldPrice) {
  const roomTitleEl = document.getElementById("roomTitle");
  if (roomTitleEl) roomTitleEl.innerText = title;
  const roomDescEl = document.getElementById("roomDesc");
  if (roomDescEl) roomDescEl.innerText = desc;

  if (Array.isArray(prices)) {
    const pHourEl = document.getElementById("pHour");
    // Sử dụng index 1: giá giờ
    if (pHourEl) pHourEl.innerText = formatVND(prices[1]);

    const pFullEl = document.getElementById("pFull");
    // Sử dụng index 0: ngày hiện tại
    if (pFullEl) pFullEl.innerText = formatVND(prices[0]);

    const newPriceEl = document.getElementById("newPrice");
    // Sử dụng index 0: ngày hiện tại
    if (newPriceEl) newPriceEl.innerText = formatVND(prices[0]);
  } else {
    const newPriceEl2 = document.getElementById("newPrice");
    if (newPriceEl2)
      newPriceEl2.innerText = prices && prices[0] ? prices[0] : "";
  }

  const oldPriceEl = document.getElementById("oldPrice");
  if (oldPriceEl)
    oldPriceEl.innerText = oldPrice ? formatVND(Number(oldPrice)) : "";

  renderGallery(images);

  const ag = document.getElementById("roomAmenities");
  if (ag) ag.innerHTML = "";

  const amenitiesList = Array.isArray(amen) ? amen : [amen];

  amenitiesList
    .filter((a) => a && a.trim() !== "")
    .forEach((a) => {
      const d = document.createElement("div");
      d.className = "amenity-item";
      const icon = a.toLowerCase().includes("wifi")
        ? "fa-wifi"
        : a.toLowerCase().includes("tv")
        ? "fa-tv"
        : a.toLowerCase().includes("nước")
        ? "fa-glass-water"
        : a.toLowerCase().includes("thang máy")
        ? "fa-elevator"
        : a.toLowerCase().includes("view")
        ? "fa-mountain-sun"
        : a.toLowerCase().includes("minibar")
        ? "fa-bottle-water"
        : a.toLowerCase().includes("sấy tóc")
        ? "fa-wind"
        : a.toLowerCase().includes("netflix")
        ? "fa-display"
        : a.toLowerCase().includes("đỗ xe")
        ? "fa-square-parking"
        : "fa-check";
      d.innerHTML = `<i class="fa-solid ${icon}"></i><span>${a}</span>`;
      if (ag) ag.appendChild(d);
    });

  const roomModalEl = document.getElementById("roomModal");
  if (roomModalEl) {
    roomModalEl.style.display = "block";
    document.body.style.overflow = "hidden";
  }
}

function closeRoom() {
  const roomModalClose = document.getElementById("roomModal");
  if (roomModalClose) {
    roomModalClose.style.display = "none";
  }
  document.body.style.overflow = "";

  const activeHeaders = document.querySelectorAll(
    "#roomModal .accordion-header.active"
  );
  if (activeHeaders && activeHeaders.length) {
    activeHeaders.forEach((h) => {
      h.classList.remove("active");
      if (h.nextElementSibling) {
        h.nextElementSibling.style.maxHeight = null;
        h.nextElementSibling.classList.remove("active");
      }
    });
  }
}

window.addEventListener("error", function (e) {
  console.warn("Captured error:", e.message, "at", e.filename + ":" + e.lineno);
});

document.addEventListener("DOMContentLoaded", () => {
  try {
    if (typeof setupAccordions === "function") setupAccordions();

    ["roomModal", "bankModal"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("click", (e) => {
          if (e.target === el) closeModal(id);
        });
      }
    });
  } catch (err) {
    console.warn("Init error", err);
  }
});
