import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Node} from '../../common/node/node';
import {NodeModel} from '../../common/node-model/node-model';
import {Triad} from "../../common/triad/triad";

@Injectable({
  providedIn: 'root'
})
export class PairwiseService {

  //http://localhost:8081/

  private updateFinalResultUrl = 'http://localhost:8081/v1/update';
  private maxInconsistencyUrl = 'http://localhost:8081/v1/max-inconsistency';
  private reduceInconsistencyUrl = 'http://localhost:8081/v1/reduce-inconsistency';
  private getListOfNodesUrlOld = 'http://localhost:8081/v1/nodes';
  private getListOfNodesUrl = 'http://localhost:8081/nodes';
  private getTreeNodeUrl = 'http://localhost:8081/v1/tree';
  private baseUrl = 'http://localhost:8081/v1/pairwise';
  private fileUpload = 'http://localhost:8081/v1/upload';
  private fileDownload = 'http://localhost:8081/v1/example-download';
  private exportResultURL = 'http://localhost:8081/v1/export';
  private analyzeUrl = 'http://localhost:8081/v1/analyze';
  private resetUrl = 'http://localhost:8081/v1/reset';

  private downloadTreeURL = 'http://localhost:8081/download-tree';

//http://localhost:8081
  constructor(
    private httpClient: HttpClient
  ) {
  }

  getPairwiseResult(data: number[][], numberPassed: number): Observable<number[][]> {
    const updateFinalResultUrl = `${this.updateFinalResultUrl}?num=${numberPassed}`;
    return this.httpClient.post<number[][]>(updateFinalResultUrl, data);
  }

  getListOfNodes(): Observable<GetResponseNode> {
    return this.httpClient.get<GetResponseNode>(this.getListOfNodesUrl);
  }

  addNode(node: Node): Observable<Node[]> {
    return this.httpClient.post<Node[]>(this.baseUrl, node);
  }

  deleteNode(nodeIdToDelete: number): Observable<Node[]> {
    const deleteUrl = `${this.baseUrl}?nodeId=${nodeIdToDelete}`;
    return this.httpClient.delete<Node[]>(deleteUrl);
  }

  updateNode(node: Node): Observable<Node[]> {
    return this.httpClient.put<Node[]>(this.baseUrl, node);
  }

  getTreeNode(): Observable<NodeModel[]> {
    return this.httpClient.get<NodeModel[]>(this.getTreeNodeUrl);
  }

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.fileUpload}`, formData, {
      reportProgress: true,
      responseType: 'json',
    });
    return this.httpClient.request(req);
  }

  getFiles(): Observable<Blob> {
    return this.httpClient.get(`${this.fileDownload}`, {responseType: 'blob'});
  }

  analyze(nodeId: number, tolerance: number): Observable<any> {
    return this.httpClient.get(`${this.analyzeUrl}?nodeId=${nodeId}&tolerance=${tolerance}`);
  }

  maxInconsistency(data: any[]): Observable<Triad[]> {
    return this.httpClient.post<Triad[]>(this.maxInconsistencyUrl, data);
  }

  reduceInconsistencyTriad(data: any[]): Observable<Triad[]> {
    return this.httpClient.post<Triad[]>(this.reduceInconsistencyUrl, data);
  }

  reset(): Observable<any> {
    return this.httpClient.get(`${this.resetUrl}`);
  }

  exportResult(): Observable<Blob> {
    return this.httpClient.get(`${this.exportResultURL}`, {responseType: 'blob'});
  }

  downloadTree(): Observable<Blob> {
    return this.httpClient.get(`${this.downloadTreeURL}`, {responseType: 'blob'});
  }
}

interface GetResponseNode {
  _embedded: {
    node: Node[];
  };
}
