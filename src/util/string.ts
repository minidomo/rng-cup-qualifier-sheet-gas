namespace StringUtil {
    export function convert(value: any) {
        if (typeof value === 'string') {
            return value.trim();
        }

        return `${value}`;
    }
}
