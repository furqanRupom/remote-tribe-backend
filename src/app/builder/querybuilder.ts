import { ModelNames, PrismaModelDelegate } from "./types"

class QueryBuilder<T extends ModelNames> {
    private model: PrismaModelDelegate<T>
    private query: Record<string, any>
    private whereConditions: Record<string, any> = {}
    private options: {
        include?: Record<string, boolean | object>
        select?: Record<string, boolean | object>
    } = {}
    private usedSelectOrInclude: 'select' | 'include' | null = null
    constructor(model: PrismaModelDelegate<T>, query: Record<string, any>) {
        this.model = model
        this.query = { ...query }
    }
    search(searchableFields: string[]) {
        const searchTerm = this.query.searchTerm as string
        if (searchTerm) {
            const searchConditions = searchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            }))
            this.whereConditions = {
                ...this.whereConditions,
                OR: searchConditions,
            }
        }
        return this
    }
    filter(preTypeData?: Record<string, unknown>, arrayFields: string[] = []) {
        const { searchTerm, limit, page, total, sort, ...filterData } = this.query
        const combinedFilterData = { ...filterData, ...preTypeData }
        const filterConditions = Object.keys(combinedFilterData).reduce((conditions, field) => {
            let value = combinedFilterData[field]

            if (value !== undefined) {
                if (arrayFields.includes(field) && typeof value === 'string') {
                    const valuesArray = value.split(',').map(item => item.trim()).filter(Boolean)
                    conditions[field] =
                        valuesArray.length === 1 ? { has: valuesArray[0] } : { hasSome: valuesArray }
                } else {
                    conditions[field] = value
                }
            }

            return conditions
        }, {} as Record<string, any>)

        if (Object.keys(filterConditions).length > 0) {
            this.whereConditions = {
                ...this.whereConditions,
                AND: [...(this.whereConditions.AND || []), filterConditions],
            }
        }

        return this
    }
      

    sort() {
        const sortString = this.query.sort || 'createdAt'
        this.query.orderBy = this.parseSort(sortString)
        return this
    }
    paginate() {
        const page = Number(this.query.page) || 1
        const limit = Number(this.query.limit) || 10
        const skip = (page - 1) * limit
        this.query.skip = skip
        this.query.take = limit
        return this
    }
    fields() {
        const fields = (this.query.fields as string)?.split(',') || []
        if (fields.length > 0) {
            this.query.select = fields.reduce(
                (acc, field) => {
                    acc[field] = true
                    return acc
                },
                {} as Record<string, boolean>,
            )
        }
        return this
    }
    async countTotal() {
        const total = await (this.model as any).count({
            where: {
                ...this.whereConditions,
            },
        })
        const page = Number(this.query.page) || 1
        const limit = Number(this.query.limit) || 10
        const totalPages = Math.ceil(total / limit)
        return {
            page,
            limit,
            total,
            totalPages,
        }
    }
    include(include: Record<string, boolean | object>) {
        this.validateSelectOrInclude('include')
        this.options.include = include
        return this
    }

    select(select: Record<string, boolean | object>) {
        this.validateSelectOrInclude('select')
        this.options.select = select
        return this
    }

    private validateSelectOrInclude(type: 'select' | 'include') {
        if (this.usedSelectOrInclude && this.usedSelectOrInclude !== type) {
            throw new Error(
                `Cannot call ${type} after ${this.usedSelectOrInclude} has been called.`,
            )
        }
        this.usedSelectOrInclude = type
    }
    async execute() {
        const query = { ...this.query }
        delete query.searchTerm
        delete query.page
        delete query.limit
        delete query.fields
        const queryObj = {
            take: query.take,
            skip: query.skip,
            orderBy: query.orderBy,
            where: {
                ...this.whereConditions,
            },
            ...this.options,
        }
        return await (this.model as any).findMany(queryObj)
    }
    private parseSort(sort: string) {
        return sort.split(',').map(field => {
            const [key, order = 'desc'] = field.split(':')
            return { [key.trim()]: order.trim() }
        })
    }
}

export default QueryBuilder
