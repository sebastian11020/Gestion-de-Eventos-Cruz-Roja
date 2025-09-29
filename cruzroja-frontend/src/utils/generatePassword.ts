// utils/generatePassword.ts
export function generatePassword(length = 12): string {
    const sets = {
        upper: "ABCDEFGHJKLMNPQRSTUVWXYZ",  // sin I/O para evitar confusión
        lower: "abcdefghijkmnopqrstuvwxyz", // sin l
        number: "23456789",                 // sin 0/1
        symbol: "!@#$%^&*()-_=+[]{};:,.?",
    };

    let pool = sets.upper + sets.lower + sets.number + sets.symbol;

    const mustInclude = [
        pick(sets.upper),
        pick(sets.lower),
        pick(sets.number),
        pick(sets.symbol),
    ];

    const result = [...mustInclude];
    while (result.length < length) result.push(pick(pool));

    shuffle(result);
    return result.join("");

    // helpers
    function pick(chars: string) {
        const arr = new Uint32Array(1);
        crypto.getRandomValues(arr); // seguro en front y back
        return chars[arr[0] % chars.length];
    }

    function shuffle(a: string[]) {
        const arr = new Uint32Array(a.length);
        crypto.getRandomValues(arr);
        for (let i = a.length - 1; i > 0; i--) {
            const j = arr[i] % (i + 1);
            [a[i], a[j]] = [a[j], a[i]];
        }
    }
}
