export class EventTracker {
    maxEvents: any;
    timeRange: any;
    numBuckets: any;
    buckets: any[];
    totalEvents: number;
    currentBucketIndex: number;
    lastBucketTime: number;
    onThresholdTriggered: any;
    
    constructor({maxEvents, timeRangeInHours, onThresholdTriggered}) {
      this.maxEvents = maxEvents; // Maximum allowed events in the time range
      this.timeRange = timeRangeInHours; // Total time range in hours
      this.numBuckets = timeRangeInHours; // One bucket per hour
      this.buckets = Array(this.numBuckets).fill(0); // Initialize buckets to zero
      this.totalEvents = 0; // Total events in the sliding window
      this.currentBucketIndex = 0; // Tracks the "current" bucket
      this.lastBucketTime = Date.now(); // Timestamp when the last bucket was updated
      this.onThresholdTriggered = onThresholdTriggered
    }
  
    addEvent() {
      const now = Date.now();
      const elapsedHours = Math.floor((now - this.lastBucketTime) / (60 * 60 * 1000)); // Calculate elapsed hours
  
      // Shift buckets if needed
      if (elapsedHours > 0) {
        this.shiftBuckets(elapsedHours);
        this.lastBucketTime = now; // Update last bucket time
      }
  
      // Add the event to the current bucket
      this.buckets[this.currentBucketIndex]++;
      this.totalEvents++;
  
      // Check if we need to trigger the function
      if (this.totalEvents > this.maxEvents) {
        this.onThresholdTriggered()
      }
    }
  
    shiftBuckets(elapsedHours) {
      const bucketsToShift = Math.min(this.numBuckets, elapsedHours); // Shift only up to the total number of buckets
  
      for (let i = 0; i < bucketsToShift; i++) {
        // Move to the next bucket in a circular manner
        const expiredBucketIndex = (this.currentBucketIndex + 1) % this.numBuckets;
  
        // Subtract the expired bucket's count from the total
        this.totalEvents -= this.buckets[expiredBucketIndex];
        this.buckets[expiredBucketIndex] = 0; // Reset the expired bucket
  
        // Update the current bucket index
        this.currentBucketIndex = expiredBucketIndex;
      }
    }
  
  }