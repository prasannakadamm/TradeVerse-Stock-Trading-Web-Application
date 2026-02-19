import * as YF from 'yahoo-finance2';
console.log('Keys:', Object.keys(YF));
try {
    const def = (await import('yahoo-finance2')).default;
    console.log('Default:', def);
    console.log('Type of Default:', typeof def);
} catch (e) {
    console.log('Error importing default:', e);
}
