namespace RowUtil {
    export function isEmpty(row: any[]) {
        return row.every(e => typeof e === 'string' && e === '');
    }

    export function hasEmpty(row: any[]) {
        return row.some(e => typeof e === 'string' && e === '');
    }
}
