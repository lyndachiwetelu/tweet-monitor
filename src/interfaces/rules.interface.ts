export interface Rules {
    data?: Array<{id: string, value: string}>
    meta: {
      sent: string
      summary?: { created?: number, not_created?: number, valid?: number, invalid?: number,  deleted?: number, not_deleted? :number }
    }
}