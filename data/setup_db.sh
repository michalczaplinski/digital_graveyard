#!/bin/bash
psql --user=czapla postgres < create_database.sql
psql --user=grabarz digital_graveyard < create_tables.sql
