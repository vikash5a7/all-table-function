import { Component, OnInit } from '@angular/core'
import { first } from 'rxjs/operators'

import { Audit, User } from '@/_models'
import { AuditService, AuthenticationService } from '@/_services'
import { time } from 'console'
import { threadId } from 'worker_threads'

@Component({ templateUrl: 'audit.component.html' })
export class AuditComponent implements OnInit {
  page: number = 1
  audits = []
  currentUser: User
  search: any
  ascending: boolean = false
  selectedType = '12H'
  constructor(
    private authenticationService: AuthenticationService,
    private auditService: AuditService
  ) {
    this.currentUser = this.authenticationService.currentUserValue
  }

  ngOnInit() {
    this.loadAllAudits()
  }

  private loadAllAudits() {
    this.auditService
      .getAll()
      .pipe(first())
      .subscribe((audits) => (this.audits = audits))
  }

  Search() {
    console.log('searching for', this.search)
    if (this.search == null || this.search.length == 0) {
      this.ngOnInit()
    } else {
      this.audits = this.filterAudit(this.audits, this.search)
    }
  }

  filterAudit(audits: Audit[], searchTerm: string) {
    if (!audits || !searchTerm) {
      console.log('searching the ' + searchTerm)
      return audits
    } else {
      return audits.filter((audit) => {
        if (
          searchTerm &&
          audit.user.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
        ) {
          return true
        }
        if (
          searchTerm &&
          audit.ip.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
        ) {
          return true
        }
        return false
      })
    }
  }

  onChange(event) {
    this.selectedType = event.target.value
  }
  sort(colName, boolean) {
    if (boolean == true) {
      this.audits.sort((a, b) =>
        a[colName] < b[colName] ? 1 : a[colName] > b[colName] ? -1 : 0
      )
      this.ascending = !this.ascending
    } else {
      this.audits.sort((a, b) =>
        a[colName] > b[colName] ? 1 : a[colName] < b[colName] ? -1 : 0
      )
      this.ascending = !this.ascending
    }
  }
}
