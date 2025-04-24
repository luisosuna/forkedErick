export class InterviewUtilities {

    public static solutionRichardLedesma(A){
        A = A.sort((a, b) => a - b);
        let smallest = 1;
      
        for (let i = 0; i < A.length; i++) {
          if (A[i] === smallest) {
            smallest++;
          }
        }
      
        return smallest;
      }
}