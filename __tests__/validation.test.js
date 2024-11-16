const { describe, test, expect } = require("@jest/globals");
const Polyfunc = require("../polytech.js");

describe("Normal types work", () => {
    test("Number", () => {
        expect(
            new Polyfunc().
            match('number').set(() => "number!").
            evaluate(1)
        ).toBe("number!");
    });
    test("String", () => {
        expect(
            new Polyfunc().
            match('string').set(() => "string!").
            evaluate("hey")
        ).toBe("string!");
    });
    test("Boolean", () => {
        expect(
            new Polyfunc().
            match('boolean').set(() => "boolean!").
            evaluate(true)
        ).toBe("boolean!");
    });
    test("Bigint", () => {
        expect(
            new Polyfunc().
            match('bigint').set(() => "bigint!").
            evaluate(1n)
        ).toBe("bigint!");
    });
    test("Array", () => {
        expect(
            new Polyfunc().
            match('array').set(() => "array!").
            evaluate([])
        ).toBe("array!");
        expect(
            new Polyfunc().
            match('array').set(() => "array!").
            fallback(() => "nothing").
            evaluate({})
        ).toBe("nothing");

        // Since typeof regexp is "object", make sure regexp does NOT trigger the array
        expect(
            new Polyfunc().
            match('array').set(() => "array!").
            fallback(() => "nothing").
            evaluate(/regexp/)
        ).toBe("nothing");
    });
    test("Hash", () => {
        expect(
            new Polyfunc().
            match('hash').set(() => "hash!").
            fallback(() => "nothing").
            evaluate([])
        ).toBe("nothing");
        expect(
            new Polyfunc().
            match('hash').set(() => "hash!").
            evaluate({})
        ).toBe("hash!");

        // Since typeof regexp is "object", make sure regexp does NOT trigger the hash
        expect(
            new Polyfunc().
            match('hash').set(() => "hash!").
            fallback(() => "nothing").
            evaluate(/regexp/)
        ).toBe("nothing");
    });
    test("Object", () => {
        expect(
            new Polyfunc().
            match('object').set(() => "object!").
            fallback(() => "nothing").
            evaluate([])
        ).toBe("object!");
        expect(
            new Polyfunc().
            match('object').set(() => "object!").
            evaluate({})
        ).toBe("object!");

        // Since typeof regexp is "object", make sure regexp does NOT trigger the object
        expect(
            new Polyfunc().
            match('object').set(() => "object!").
            fallback(() => "nothing").
            evaluate(/regexp/)
        ).toBe("nothing");
    });
    test("Nulled", () => {
        expect(
            new Polyfunc().
            match('nulled').set(() => "nulled!").
            fallback(() => "nothing").
            evaluate()
        ).toBe("nulled!");
        expect(
            new Polyfunc().
            match('nulled').set(() => "nulled!").
            fallback(() => "nothing").
            evaluate(null)
        ).toBe("nulled!");
        expect(
            new Polyfunc().
            match('nulled').set(() => "nulled!").
            fallback(() => "nothing").
            evaluate(undefined)
        ).toBe("nulled!");

        // Make sure values that are randomly null in JS are not seen as null
        expect(
            new Polyfunc().
            match('nulled').set(() => "nulled!").
            fallback(() => "nothing").
            evaluate(0)
        ).toBe("nothing");
        expect(
            new Polyfunc().
            match('nulled').set(() => "nulled!").
            fallback(() => "nothing").
            evaluate("")
        ).toBe("nothing");
        expect(
            new Polyfunc().
            match('nulled').set(() => "nulled!").
            fallback(() => "nothing").
            evaluate([])
        ).toBe("nothing");
        expect(
            new Polyfunc().
            match('nulled').set(() => "nulled!").
            fallback(() => "nothing").
            evaluate({})
        ).toBe("nothing");
    });
    test("Regular expressions", () => {
        expect(
            new Polyfunc().
            match('regexp').set(() => "regexp!").
            evaluate(/regexp/)
        ).toBe("regexp!");

        // Since typeof regexp is "object", make sure objects do NOT trigger the regexp
        expect(
            new Polyfunc().
            match('regexp').set(() => "regexp!").
            fallback(() => "nothing").
            evaluate([])
        ).toBe("nothing");
        expect(
            new Polyfunc().
            match('regexp').set(() => "regexp!").
            fallback(() => "nothing").
            evaluate({})
        ).toBe("nothing");
    });
    test("Functions", () => {
        expect(
            new Polyfunc().
            match('function').set(() => "function!").
            evaluate(() => {})
        ).toBe("function!");
        expect(
            new Polyfunc().
            match('function').set(() => "function!").
            evaluate(new Function("function k() { return 1; }"))
        ).toBe("function!");

        // Since typeof (class CLASS) is also "function", make sure classes don't trigger
        class K {}
        expect(
            new Polyfunc().
            match('function').set(() => "function!").
            fallback(() => "nothing").
            evaluate(K)
        ).toBe("nothing");
    });
    test("Value is a class", () => {
        class K {}
        expect(
            new Polyfunc().
            match('class').set(() => "class!").
            fallback(() => "nothing").
            evaluate(K)
        ).toBe("class!");

        // Since the typeof function is the same as typeof class is the same as "function",
        // make sure callable functions don't trigger
        expect(
            new Polyfunc().
            match('class').set(() => "class!").
            fallback(() => "nothing").
            evaluate(() => {})
        ).toBe("nothing");
        expect(
            new Polyfunc().
            match('class').set(() => "class!").
            fallback(() => "nothing").
            evaluate(new Function("function k() { this.z = 9; return 1; }"))
        ).toBe("nothing");
    });
    test("Functional", () => {
        class K {}
        expect(
            new Polyfunc().
            match('functional').set(() => "functional!").
            fallback(() => "nothing").
            evaluate(K)
        ).toBe("functional!");
        
        expect(
            new Polyfunc().
            match('functional').set(() => "functional!").
            fallback(() => "nothing").
            evaluate(() => {})
        ).toBe("functional!");
        expect(
            new Polyfunc().
            match('functional').set(() => "functional!").
            fallback(() => "nothing").
            evaluate(new Function("function k() { this.z = 9; return 1; }"))
        ).toBe("functional!");
    });

    test("Arguments instanceof classes", () => {
        class k {};
        expect(
            new Polyfunc().
            match(k).set(() => "class!").
            evaluate(new k())
        ).toBe("class!");
    })
});

describe("Non-nullable types don't validate null", () => {
    test("Strings", () => {
        expect(
            new Polyfunc().
            match("string").set(() => "string!").
            fallback(() => "nothing").
            evaluate()
        ).toBe("nothing");
        expect(
            new Polyfunc().
            match("string").set(() => "string :)").
            fallback(() => "nothing").
            evaluate(null)
        ).toBe("nothing");
    });

    test("Object", () => {
        expect(
            new Polyfunc().
            match("object").set(() => "object!").
            fallback(() => "nothing").
            evaluate()
        ).toBe("nothing");
        expect(
            new Polyfunc().
            match("object").set(() => "object!").
            fallback(() => "nothing").
            evaluate(null)
        ).toBe("nothing");
    });

    test("Regexp", () => {
        expect(
            new Polyfunc().
            match("regexp").set(() => "regexp!").
            fallback(() => "nothing").
            evaluate()
        ).toBe("nothing");
        expect(
            new Polyfunc().
            match("regexp").set(() => "regexp!").
            fallback(() => "nothing").
            evaluate(null)
        ).toBe("nothing");
    })

    test("Class", () => {
        expect(
            new Polyfunc().
            match("class").set(() => "class!").
            fallback(() => "nothing").
            evaluate()
        ).toBe("nothing");
        expect(
            new Polyfunc().
            match("class").set(() => "class? :)").
            fallback(() => "nothing").
            evaluate(null)
        ).toBe("nothing");
    });
});

describe("Nullable types work", () => {
    test("Strings", () => {
        expect(
            new Polyfunc().
            match("string?").set(() => "string? :)").
            evaluate("string")
        ).toBe("string? :)");
        expect(
            new Polyfunc().
            match("string?").set(() => "string? :)").
            evaluate(null)
        ).toBe("string? :)");
    });

    test("Array", () => {
        expect(
            new Polyfunc().
            match("array?").set(() => "array? :)").
            evaluate()
        ).toBe("array? :)");
        expect(
            new Polyfunc().
            match("array?").set(() => "array? :)").
            evaluate(null)
        ).toBe("array? :)");

        expect(
            new Polyfunc().
            match("array?").set(() => "array? :)").
            evaluate([])
        ).toBe("array? :)");
        expect(
            new Polyfunc().
            match("array?").set(() => "array? :)").
            evaluate(["this is an element that is not null"])
        ).toBe("array? :)");
    });
    test("Hash", () => {
        expect(
            new Polyfunc().
            match("hash?").set(() => "hash? :)").
            evaluate()
        ).toBe("hash? :)");
        expect(
            new Polyfunc().
            match("hash?").set(() => "hash? :)").
            evaluate(null)
        ).toBe("hash? :)");
    });
    test("Object", () => {
        expect(
            new Polyfunc().
            match("object?").set(() => "object? :)").
            evaluate()
        ).toBe("object? :)");
        expect(
            new Polyfunc().
            match("object?").set(() => "object? :)").
            evaluate(null)
        ).toBe("object? :)");
    });

    test("Regexp", () => {
        expect(
            new Polyfunc().
            match("regexp?").set(() => "regexp? :)").
            evaluate(/regexp/)
        ).toBe("regexp? :)");
        expect(
            new Polyfunc().
            match("regexp?").set(() => "regexp? :)").
            evaluate(null)
        ).toBe("regexp? :)");
    });

    test("Class", () => {
        expect(
            new Polyfunc().
            match("class?").set(() => "class? :)").
            evaluate()
        ).toBe("class? :)");
        expect(
            new Polyfunc().
            match("class?").set(() => "class? :)").
            evaluate(null)
        ).toBe("class? :)");
    });
});

describe("Multiple rules work", () => {});