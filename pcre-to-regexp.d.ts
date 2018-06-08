export = pcre_to_regexp;

declare function pcre_to_regexp(pattern: String, namedCaptures: Array<any>): RegExp;

declare namespace pcre_to_regexp {
    const characterClasses: {
        alnum: string;
        alpha: string;
        blank: string;
        cntrl: string;
        digit: string;
        graph: string;
        lower: string;
        print: string;
        punct: string;
        space: string;
        upper: string;
        word: string;
        xdigit: string;
    };

}

