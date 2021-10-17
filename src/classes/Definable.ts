import definables from "../maps/definables";
import slugRegExp from "../constants/slugRegExp";

class Definable {
    protected readonly list: Map<string, Definable>;
    protected readonly slug: string;
    public constructor(slug: string) {
        this.slug = slug;
        if (new RegExp(slugRegExp, "gu").test(this.slug) === false) {
            throw new Error(`${this.constructor.name} "${this.slug}" has an invalid slug.`);
        }
        if (definables.has(this.constructor.name) === false) {
            definables.set(this.constructor.name, new Map);
        }
        this.list = definables.get(this.constructor.name) as Map<string, Definable>;
        if (this.list.has(this.slug)) {
            throw new Error(`${this.constructor.name} "${this.slug}" already exists.`);
        }
        this.list.set(this.slug, this);
    }

    public getSlug(): string {
        return this.slug;
    }
}

export default Definable;