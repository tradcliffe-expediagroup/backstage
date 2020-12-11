/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React from 'react';
import { TableColumn } from '@backstage/core';
import { Chip, Link } from '@material-ui/core';
import { Entity } from '@backstage/catalog-model';
import { generatePath, Link as RouterLink } from 'react-router-dom';
import { CatalogTable } from '@backstage/plugin-catalog';
// TR TOOD: Need to figure out how to deal with needed exports from the routes inside of plugin. Should render methods or links go here? I haven't even looked at the two methods below
import { entityRoute, entityRouteParams } from '../../routes';

export const CatalogTableHeader = () => {
  <CatalogTable>
    <CatalogTable.Header
      title="Name"
      field="metadata.name"
      highlight="true"
      render={(entity: any) => (
        <Link
          component={RouterLink}
          to={generatePath(entityRoute.path, {
            ...entityRouteParams(entity),
            selectedTabId: 'overview',
          })}
        >
          {entity.metadata.name}
        </Link>
      )}
    />
    <CatalogTable.Header title="Owner" field="spec.owner" />
    <CatalogTable.Header title="Lifecycle" field="spec.lifestyle" />
    <CatalogTable.Header title="Description" field="metadata.description" />
    <CatalogTable.Header
      title="Tags"
      field="metadata.tags"
      cellStyle={{
        padding: '0px 16px 0px 20px',
      }}
      render={(entity: Entity) => (
        <>
          {entity.metadata.tags &&
            entity.metadata.tags.map(t => (
              <Chip
                key={t}
                label={t}
                size="small"
                variant="outlined"
                style={{ marginBottom: '0px' }}
              />
            ))}
        </>
      )}
    />
  </CatalogTable>;
};
