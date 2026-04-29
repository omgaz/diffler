//#region src/index.ts
var e = (e) => typeof e == "object" && !!e && !Array.isArray(e), t = (e, t) => Object.hasOwn(e, t) && typeof e[t] != "function", n = (t, i) => {
	if (typeof t != typeof i) return {
		from: t,
		to: i
	};
	if (Array.isArray(t) && Array.isArray(i)) {
		let e = {}, r = Math.max(t.length, i.length);
		for (let a = 0; a < r; a++) {
			let r = n(t[a], i[a]);
			r && (e[a] = r);
		}
		return Object.keys(e).length > 0 ? e : null;
	}
	if (e(t) && e(i)) {
		let e = r(t, i);
		return Object.keys(e).length > 0 ? e : null;
	}
	return t === i ? null : {
		from: t,
		to: i
	};
}, r = (e, r) => {
	let i = {};
	for (let a in e) {
		if (!t(e, a)) continue;
		if (!(a in r)) {
			i[a] = {
				from: e[a],
				to: null
			};
			continue;
		}
		let o = n(e[a], r[a]);
		o && (i[a] = o);
	}
	for (let n in r) t(r, n) && (n in e || (i[n] = {
		from: null,
		to: r[n]
	}));
	return i;
};
//#endregion
export { r as default };
