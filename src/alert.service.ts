import { Injectable } from '@nestjs/common';

@Injectable()
export class AlertService {
    // For simplicity the alert is a console.log, could also be an email 
    // and could emit an event with a configured listener
    alert(details:any): void {
        console.log(
            `[ALERT!!!] Tweets Toxicity level increased between ${details.fromDate} and ${details.toDate}
             from ${details.lastToxicityCount} to ${details.currentToxicityCount} Tweets`)
    }
}