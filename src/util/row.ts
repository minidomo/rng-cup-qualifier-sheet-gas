namespace RowUtil {
    export function isEmpty(row: any[]) {
        return row.every(e => typeof e === 'string' && e === '');
    }
}