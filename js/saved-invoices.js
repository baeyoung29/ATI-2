const SAVED_INVOICE_TYPES = {
	sales: "Sales Tax Invoice",
	purchase: "Purchase Invoice",
	proforma: "Pro Forma Invoice",
	credit: "Credit Note"
};

let savedInvoiceRecords = [];

function loadSavedInvoices(profile, user) {
	const list = document.getElementById("savedInvoiceList");
	db.collection("users").doc(user.uid).collection("invoices")
		.orderBy("createdAt", "desc").limit(200).get()
		.then(snapshot => {
			savedInvoiceRecords = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
			renderSavedInvoices();
		})
		.catch(error => {
			console.error("Could not load saved invoices:", error);
			list.innerHTML = "<p class='savedEmpty'>Could not load saved invoices. Please check your connection and try again.</p>";
		});
	document.getElementById("savedSearch").addEventListener("input", renderSavedInvoices);
	document.getElementById("savedType").addEventListener("change", renderSavedInvoices);
}

function renderSavedInvoices() {
	const list = document.getElementById("savedInvoiceList");
	const query = document.getElementById("savedSearch").value.trim().toLowerCase();
	const type = document.getElementById("savedType").value;
	const records = savedInvoiceRecords.filter(record => {
		const customer = (record.customer && record.customer.name) || "Unnamed";
		const matchesSearch = (String(record.invoiceNo || "") + " " + customer).toLowerCase().includes(query);
		return matchesSearch && (type === "all" || (record.type || "sales") === type);
	});

	if (!records.length) {
		list.innerHTML = `<p class="savedEmpty">${savedInvoiceRecords.length ? "No invoices match your search." : "No invoices have been saved yet."}</p>`;
		return;
	}

	list.replaceChildren(...records.map(record => {
		const card = document.createElement("article");
		card.className = "savedCard";
		const title = document.createElement("h2");
		const invoiceNo = String(record.invoiceNo || "").padStart(4, "0");
		title.textContent = `${SAVED_INVOICE_TYPES[record.type] || SAVED_INVOICE_TYPES.sales} · INV-${invoiceNo}`;
		const meta = document.createElement("p");
		meta.className = "savedMeta";
		const date = record.date || "No date";
		const customer = (record.customer && record.customer.name) || "Unnamed customer";
		const total = Number(record.grandTotal || 0).toLocaleString("en-AE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
		meta.textContent = `${customer} · ${date} · AED ${total}`;
		const actions = document.createElement("div");
		actions.className = "savedActions";
		const open = document.createElement("button");
		open.type = "button";
		open.textContent = "Open in editor";
		open.addEventListener("click", () => { window.location.href = `home.html?invoiceId=${encodeURIComponent(record.id)}`; });
		const download = document.createElement("button");
		download.type = "button";
		download.className = "downloadButton";
		download.textContent = "Download record";
		download.addEventListener("click", () => downloadInvoiceRecord(record));
		actions.append(open, download);
		card.append(title, meta, actions);
		return card;
	}));
}

function downloadInvoiceRecord(record) {
	const file = new Blob([JSON.stringify(record, null, 2)], { type: "application/json" });
	const url = URL.createObjectURL(file);
	const link = document.createElement("a");
	link.href = url;
	link.download = `ATI-${record.type || "sales"}-INV-${String(record.invoiceNo || "").padStart(4, "0")}.json`;
	link.click();
	setTimeout(() => URL.revokeObjectURL(url), 1000);
}
