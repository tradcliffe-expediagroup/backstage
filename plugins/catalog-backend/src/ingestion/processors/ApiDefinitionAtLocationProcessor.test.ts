import { ApiEntity, Entity, LocationSpec } from '@backstage/catalog-model';
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
import { ApiDefinitionAtLocationProcessor } from './ApiDefinitionAtLocationProcessor';

describe('ApiDefinitionAtLocationProcessor', () => {
  let processor: ApiDefinitionAtLocationProcessor;
  let entity: Entity;
  let location: LocationSpec;

  beforeEach(() => {
    processor = new ApiDefinitionAtLocationProcessor();
    entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'API',
      metadata: {
        name: 'test',
      },
      spec: {
        lifecycle: 'production',
        owner: 'info@example.com',
        type: 'openapi',
        definition: 'Hello',
      },
    };
    location = {
      type: 'url',
      target: `http://example.com/api.yaml`,
    };
  });

  it('should skip entities without annotation', async () => {
    const read = jest.fn().mockRejectedValue(new Error('boo'));

    const generated = (await processor.processEntity(
      entity,
      location,
      () => {},
      read,
    )) as ApiEntity;

    expect(generated.spec.definition).toBe('Hello');
  });

  it('should load from location', async () => {
    entity.metadata.annotations = {
      'backstage.io/definition-at-location':
        'url:http://example.com/openapi.yaml',
    };

    const read = jest.fn().mockResolvedValue(Buffer.from('Hello'));

    const generated = (await processor.processEntity(
      entity,
      location,
      () => {},
      read,
    )) as ApiEntity;

    expect(generated.spec.definition).toBe('Hello');
    expect(read.mock.calls[0][0]).toStrictEqual({
      type: 'url',
      target: 'http://example.com/openapi.yaml',
    });
  });

  it('should throw errors while loading', async () => {
    entity.metadata.annotations = {
      'backstage.io/definition-at-location': 'missing',
    };

    const read = jest
      .fn()
      .mockRejectedValue(new Error('Failed to load location'));

    await expect(
      processor.processEntity(entity, location, () => {}, read),
    ).rejects.toThrow('Failed to load location');
  });
});
