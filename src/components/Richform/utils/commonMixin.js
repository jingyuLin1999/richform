export default {
    methods: {
        friendValue(type) {
            let value = null;
            switch (type) {
                case "string":
                    value = "";
                    break;
                case "array":
                    value = [];
                    break;
                case "object":
                    value = {};
                    break;
                case "boolean":
                    value = false;
                    break;
                case "number":
                    value = 0;
                    break;
            }
            return value;
        },
    }
}